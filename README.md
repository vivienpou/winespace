# bordeaux-0918-js-winespace

The aim of this project consists to recover data from the web,and interprate it through Stanford Natural Processing Language. We build a web environnement with user and administrator interface, we call an API to load data into the webpage. Then we retrieve data from a robot which gives us comments from the web to analyse it through Stanford NPL. We extract it to give notation to wines.

## Installing

1- Fork AND clone the project

2- Install NPM packages

Open terminal and type :

```
cd /frontend 
npm install

cd ../backend
npm install

```

3- Configure your BDD access

Create conf.js file in /backend/routes

```
touch /backend/routes/conf.js

``` 
========= > Copy and Past the following code into the conf.js file < =========

```
import mysql from 'mysql';


const connection = mysql.createConnection({
  host: '',
  port: '',
  user: '',
  password: '',
  database: '',
});

export default connection;

```

4 - Add environment variables

========= > Create .env file in /frontend < =========


```
REACT_APP_API_URL=http://localhost:4000

REACT_APP_FRONT_URL=http://localhost:3000

```
## Run the project

In /frontend folder,
open terminal and type :

```
npm start

```
In /backend folder,
open terminal and type :

```
npm start

```

#NATURAL PROCESSING LANGUAGE,  make it works on this project########################
In the administration part, analyze comments only works if you follow instructions below.


## If you use Linux, install a virtual environment:
Why ? We need an isolated space on the system for Python projects, cause Python has it’s own unique way of downloading,storing and resolving packages.

https://gist.github.com/frfahim/73c0fad6350332cef7a653bcd762f08d

### Install pip for python 3
This is a package management system used to install & manage software packages which are found in the Python Package Index(PyPi)

sudo apt-get install python3-pip

to check your version of pip

pip –version

### Install virtualenv using pip3
virtualenv is used to manage Python packages for different projects. Using virtualenv allows you to avoid installing Python packages globally which could break system tools or other projects. You can install virtualenv using pip.

sudo apt-get install python-virtualenv

to check your version of virtualenv

virtualenv –version

### Create your virtual environment
virtualenv allows you to manage separate package installations for different projects. It essentially allows you to create a “virtual” isolated Python installation and install packages into that virtual installation. When you switch projects, you can simply create a new virtual environment and not have to worry about breaking the packages installed in the other environments. It is always recommended to use a virtualenv while developing Python applications.
To create a virtual environment, go to your project’s directory and...

Open terminal

Create a directory for your environment

mkdir virtualenvironment

change your directory to your new folder

cd virtualenvironment

Create the virtual environment

python3 -m venv my-virtual-environment-name 

cd bin
### Active your virtual environment:
Before you can start installing or using packages in your virtualenv you’ll need to activate it. Activating a virtualenv will put the virtualenv-specific python and pip executables into your shell’s PATH.
When you are in the directory virtualenvironment-name/bin/

source activate 

It works fine when you see (my-virtual-environment-name)  in the shell 

Here, your virtual environment is ready, keep your terminal open … 

##  IDLE: 
using IDLE, Python's own IDE (Integrated Development Environment) — combined source code editor and Python interpreter GUI. 

Idle

It works fine when you see this python’s shell opened.

## In python’s scripts, you need to change some path’s folders :

In files ended by .py, you can access to the python's scripts. To make it works, you need to change all absolute path's 


## Install some libraries :
Go in the directory  pythonscripts/myvirtualenvironment/lib/python3.6/site-packages

Open terminal
### Install MySql :
To access MySql from a Python application, it requires a database driver ,called a « connector ».
We use the open source driver : mysqlclient 1.3.14

sudo apt-get install python-dev default-libmysqlclient-dev

nb : in Python3, ConfigParser is renamed configparser, so to avoid troubles you may need to link it to python2.7 and install ConfigParser. Read this in https://pypi.org/project/configparser/

sudo apt-get install python3-mysql.connector


### Download  for the pos-tagging process:  
https://nlp.stanford.edu/software/stanford-postagger-full-2018-10-16.zip

and extract folder  «stanford-postagger-full-2018-10-16 » in : myvirtualenvironment/lib/python3.6/site-packages'

### Install for the lemmatization process :
pip install git+https://github.com/ClaudeCoulombe/FrenchLefffLemmatizer.git


### Download NLTK : 
https://www.nltk.org/install.html

Sudo pip3 install nltk 
Change directory line 3 in the python’s scripts.

## Install Java8 (necessary for the nlp process):
The easiest option for installing Java is to use the version packaged with Ubuntu. By default, Ubuntu 18.04 includes Open JDK, which is an open-source variant of the JRE and JDK.

This package will install either OpenJDK 10 or 11.
    • Prior to September 2018, this will install OpenJDK 10. 
    • After September 2018, this will install OpenJDK 11. 
To install this version, first update the package index:

sudo apt update

Next, check if Java is already installed:

java -version

If Java is not currently installed, you'll see the following output:
Output: Command 'java' not found, but can be installed with:

apt install default-jre
apt install openjdk-11-jre-headless
apt install openjdk-8-jre-headless
apt install openjdk-9-jre-headless

Execute the following command to install OpenJDK:

sudo apt install default-jre

This command will install the Java Runtime Environment (JRE). This will allow you to run almost all Java software. 
Verify the installation with:

java -version

You'll see the following output:
Output
openjdk version "10.0.1" 2018-04-17
OpenJDK Runtime Environment (build 10.0.1+10-Ubuntu-3ubuntu1)
OpenJDK 64-Bit Server VM (build 10.0.1+10-Ubuntu-3ubuntu1, mixed mode)
You may need the Java Development Kit (JDK) in addition to the JRE in order to compile and run some specific Java-based software. 
To install the JDK, execute the following command, which will also install the JRE:

sudo apt install default-jdk

Verify that the JDK is installed by checking the version of javac, the Java compiler:

javac -version

You'll see the following output:
Output
javac 10.0.1
Next, let's look at specifying which OpenJDK version we want to install.
## Setting the JAVA_HOME Environment Variable
Many programs written using Java use the JAVA_HOME environment variable to determine the Java installation location. 
Follow this tutorial :
https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-on-ubuntu-18-04

###########################################################################################

## Built with

ReactJS / NodeJS - Express / Python / MySQL / SCSS

## Authors

Our team is composed of 5 developpers: Mickael M, Vivien P, Thomas B,Christophe P, Kevin M. 

## License 

https://wildcodeschool.fr/ sept 2018 - feb 2019
