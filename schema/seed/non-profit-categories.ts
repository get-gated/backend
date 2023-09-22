export default `
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('83394073-03ba-43c5-8e2d-a82e5ed9d14c', 'Veterans', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('c9752bbd-f233-4b2c-96e9-0d72d87d6ca2', 'Health', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('10bfb5e1-c483-4554-9480-ec9991877758', 'Education', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('5c0c9e8f-d15e-48e1-a78f-ea33e1bd9889', 'Animals', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('bc86f37a-19b4-40ba-b1b8-dcd14191f6e2', 'Environment', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('8c1ee8c4-2cba-4ce2-97b3-02a90d04b829', 'Human Services', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('ce0e9117-5452-46a3-a04b-c8e8ba5c6c61', 'International', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('8395d904-0e26-40e8-9dd3-684ff916e008', 'Faith and Spiritual', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('06c8ff55-959a-4cf9-bbcc-74f81addb60d', 'Arts & Culture', '', null)  ON CONFLICT(id) DO NOTHING;
INSERT INTO public.challenge_nonprofit_categories (id, name, description, parent_category_id) VALUES ('635da7da-99f6-45f9-89d8-cfdb365bfc67', 'blank', '', null)  ON CONFLICT(id) DO NOTHING;
`;
