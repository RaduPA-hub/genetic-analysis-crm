ALTER TABLE pacient
ADD COLUMN IF NOT EXISTS affected boolean DEFAULT false;

CREATE TABLE analysis_status_log (
    id_log serial PRIMARY KEY,
    id_pacient integer NOT NULL REFERENCES pacient(id_pacient),
    id_exome integer REFERENCES exome(id_exome),
    id_request integer REFERENCES exome_request(id_request),
    id_request_group integer REFERENCES exome_request_group(id_request_group),
    status varchar NOT NULL,
    message text,
    changed_by integer REFERENCES credentials(id_credentials),
    created_at timestamp DEFAULT now()
);

CREATE INDEX idx_analysis_status_log_id_pacient
ON analysis_status_log(id_pacient);

CREATE INDEX idx_analysis_status_log_id_request_group
ON analysis_status_log(id_request_group);

CREATE INDEX idx_analysis_status_log_status
ON analysis_status_log(status);

CREATE INDEX idx_analysis_status_log_created_at
ON analysis_status_log(created_at);
