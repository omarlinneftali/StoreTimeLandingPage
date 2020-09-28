create database users;

use users;

create table Users(
ID int auto_increment primary key,
Name nvarchar(60),
Email nvarchar(40),
Phone bigint,
UserTypeID int,
constraint fk_usersType_id  foreign key(UserTypeID) references UserType(ID)     ON DELETE set null


);

select * from users
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
flush privileges;



create table UserLogin(
ID int primary key auto_increment,
Name varchar(50),
Password varchar(50)


);



create table UserType(ID int primary key, name nvarchar(30));


insert into UserType values(1, "Barbero"), (2,"Patrocinador"), (3,"Usuario");
insert into UserLogin(Name,Password) values("freylin", "freylin123")

