CREATE TABLE Profile (
    email varchar(320) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    salt varchar(255) NOT NULL,
    hash varchar(255) NOT NULL,
    PRIMARY KEY (email),
);

CREATE TABLE PoolSettings (
    id varchar(255) NOT NULL,
    min_buy_in float NOT NULL,
    max_buy_in float NOT NULL,
    denominations varchar(255) NOT NULL,
    has_password boolean NOT NULL,
    salt varchar(255),
    hash varchar(255),
    PRIMARY KEY (id),
);

CREATE TABLE Device (
    id varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Pool (
    id varchar(255) NOT NULL,
    device_id varchar(255) NOT NULL,
    pool_name name(255) NOT NULL,
    date_created datetime NOT NULL,
    settings_id varchar(255) NOT NULL,
    admin_id varchar(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (device_id) REFERENCES Device(id),
    FOREIGN KEY (settings_id) REFERENCES PoolSettings(id),
    FOREIGN KEY (admin_id) REFERENCES Profile(email)
);

CREATE TABLE Transaction (
    id varchar(255) NOT NULL,
    pool_id varchar(255) NOT NULL,
    profile_id varchar(255) NOT NULL,
    date datetime NOT NULL,
    type ENUM('BUY_IN', 'CASH_OUT') NOT NULL,
    amount float NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED') NOT NULL
    PRIMARY KEY (id),
    FOREIGN KEY (pool_id) REFERENCES Pool(id),
    FOREIGN KEY (profile_id) REFERENCES Profile(email)
);
