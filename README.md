# UNAMCR_calendario
template with authentication to develop an api rest service
## Steps to install
1. Install Apache & PHP
```
    sudo apt install apache2 php
```
2. Enable override mode to apache & restart
```
    sudo a2enmod rewrite
    sudo service apache2 restart
```
3. Edit virtual host configuration to enable rewrite on www repo directory
```
<VirtualHost *:80>
    ServerAdmin <host>@localhost
    DocumentRoot "<repo path>/web/www"
    ServerName <hostname.test>
    ServerAlias <www.hostname.test>
    <Directory "<repo path>/web/www">
        AllowOverride All
        Allow from all
        Require all granted
    </Directory>
   <Directory "<repo path>/web/www/api">
        AllowOverride All
        Allow from all
        Require all granted
    </Directory>
</VirtualHost>
```
4. As the web admin user create "data" directory & give permisions
```
mkdir <repo path>/www/data 
chmod o=rwx <repo path>/www/data
```
