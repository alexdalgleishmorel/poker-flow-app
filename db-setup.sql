CREATE TABLE Profile (
    id varchar(255) NOT NULL,
    email varchar(320) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    salt varchar(255) NOT NULL,
    hash varchar(255) NOT NULL,
    PRIMARY KEY (id),
);

CREATE TABLE PoolSettings (
    id varchar(255) NOT NULL,
    min_buy_in float NOT NULL,
    max_buy_in float NOT NULL,
    denominations varchar(255) NOT NULL,
    has_password bit NOT NULL,
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
    pool_name varchar(255) NOT NULL,
    date_created datetime NOT NULL,
    settings_id varchar(255) NOT NULL,
    admin_id varchar(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (device_id) REFERENCES Device(id),
    FOREIGN KEY (settings_id) REFERENCES PoolSettings(id),
    FOREIGN KEY (admin_id) REFERENCES Profile(id)
);

CREATE TABLE PoolTransaction (
    id varchar(255) NOT NULL,
    pool_id varchar(255) NOT NULL,
    profile_id varchar(255) NOT NULL,
    date datetime NOT NULL,
    type varchar(255) NOT NULL,
    amount float NOT NULL,
    status varchar(255) NOT NULL
    PRIMARY KEY (id),
    FOREIGN KEY (pool_id) REFERENCES Pool(id),
    FOREIGN KEY (profile_id) REFERENCES Profile(id)
);
