/*
	Script init - campaign-manager-postgres
*/

-- public.agents definition

-- Drop table

-- DROP TABLE public.agents;

CREATE TABLE public.agents (
	agent_id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	email varchar(30) NOT NULL,
	"password" varchar(255) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "PK_3ba3ff16246ffc499a47106d19e" PRIMARY KEY (agent_id),
	CONSTRAINT "UQ_5fdef501c63984b1b98abb1e68c" UNIQUE (email)
);


-- public.leads definition

-- Drop table

-- DROP TABLE public.leads;

CREATE TABLE public.leads (
	lead_id serial4 NOT NULL,
	"name" varchar(70) NOT NULL,
	phone varchar(15) NOT NULL,
	context varchar(250) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "PK_d289409667aacd43214e3036807" PRIMARY KEY (lead_id),
	CONSTRAINT "UQ_42ebb4366d014febbcfdef39e36" UNIQUE (phone)
);


-- public.call_logs definition

-- Drop table

-- DROP TABLE public.call_logs;

CREATE TABLE public.call_logs (
	call_logs_id serial4 NOT NULL,
	notes varchar(100) NOT NULL,
	status varchar(30) NOT NULL,
	summary varchar(180) NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	lead_id int4 NOT NULL,
	agent_id int4 NOT NULL,
	CONSTRAINT "PK_fb226b52b1b7f25b2a62ffb4a31" PRIMARY KEY (call_logs_id),
	CONSTRAINT "FK_31e36efe13477c1174e905667b0" FOREIGN KEY (agent_id) REFERENCES public.agents(agent_id),
	CONSTRAINT "FK_84553310d9ec4dcd2844b9cb58c" FOREIGN KEY (lead_id) REFERENCES public.leads(lead_id) ON DELETE CASCADE
);