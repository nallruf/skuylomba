-- auto-generated definition
create table jenis
(
    id   int auto_increment
        primary key,
    nama varchar(100) null
);


-- auto-generated definition
create table kategoriLomba
(
    id      int auto_increment
        primary key,
    nama    varchar(100) null,
    idJenis int          null,
    constraint kategoriLomba_jenis_id_fk
        foreign key (idJenis) references jenis (id)
);



-- auto-generated definition
create table lomba
(
    id              int auto_increment
        primary key,
    nama            varchar(100)                null,
    gambar          varchar(100)                null,
    deadline        datetime                    null,
    jenis           enum ('ONLINE', 'OFFLINE')  null,
    biaya           enum ('GRATIS', 'BERBAYAR') null,
    tingkat         enum ('NASIONAL', 'UMUM')   null,
    linkPendaftaran varchar(100)                null,
    survey          varchar(100)                null,
    deskripsi       varchar(300)                null,
    narahubung      varchar(100)                null,
    penyelengara    varchar(100)                null,
    kategoriId      int                         null,
    diliat          int default 0               null,
    daftar          int default 0               null,
    constraint lomba_kategoriLomba_id_fk
        foreign key (kategoriId) references kategoriLomba (id)
);



-- auto-generated definition
create table users
(
    username varchar(100) null,
    email    varchar(100) null,
    password varchar(100) null,
    id       int auto_increment
        primary key
);

