
-- Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  type TEXT,
  statut TEXT NOT NULL DEFAULT 'a_venir' CHECK (statut IN ('a_venir', 'en_cours', 'termine')),
  date_debut TIMESTAMP WITH TIME ZONE,
  date_fin TIMESTAMP WITH TIME ZONE,
  lieu TEXT,
  image_principale TEXT,
  galerie_images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  documents TEXT[] DEFAULT '{}',
  partenaires_ids UUID[] DEFAULT '{}',
  resultats TEXT,
  laureats JSONB DEFAULT '[]',
  classement JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  annee_academique TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  photo TEXT,
  poste TEXT,
  profession TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  site_web TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages table (contact form)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public can view members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Public can view partners" ON public.partners FOR SELECT USING (true);

-- Anyone can submit contact messages
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Admin role setup
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies for CRUD
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage members" ON public.members FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update messages" ON public.messages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('members', 'members', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('partners', 'partners', true);

-- Storage policies - public read
CREATE POLICY "Public read events storage" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "Public read members storage" ON storage.objects FOR SELECT USING (bucket_id = 'members');
CREATE POLICY "Public read partners storage" ON storage.objects FOR SELECT USING (bucket_id = 'partners');

-- Admin upload policies
CREATE POLICY "Admins upload events" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload members" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'members' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload partners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'partners' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete events storage" ON storage.objects FOR DELETE USING (bucket_id = 'events' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete members storage" ON storage.objects FOR DELETE USING (bucket_id = 'members' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete partners storage" ON storage.objects FOR DELETE USING (bucket_id = 'partners' AND public.has_role(auth.uid(), 'admin'));

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
