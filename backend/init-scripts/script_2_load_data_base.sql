/*
	script - load data
*/

INSERT INTO public.agents
("name", email, "password", created_at, updated_at)
VALUES('Angel', 'angel@gmail.com', '$2b$10$0fkMy65Xcd2j1AYLKc72memJMdPH5.k8aUyrmZDo/.SwGkHrHIwvK', '2026-09-11 19:05:40.955', '2026-09-11 19:05:40.955');


INSERT INTO public.leads
("name", phone, context, created_at, updated_at)
VALUES('Pedro', '+12345678942', 'promo TV', '2026-09-11 18:24:53.218', '2026-09-11 18:24:53.218');
INSERT INTO public.leads
("name", phone, context, created_at, updated_at)
VALUES('Juan', '+12345678943', 'promo TV', '2026-09-11 18:25:01.666', '2026-09-11 18:25:01.666');