# Using Gitify to Collaborate on Themes

If you are working with a team of people to create a Theme, storing the components in a Git repository can be a great way to collaborate. For the purpose of this tutorial, we’ll assume you’re using [MODX Cloud](https://dashboard.modxcloud.com). 

While this document may seem intimdating at first, it really is a simple copy/paste command line exercise. Things you’ll need to access or be familiar with:

1. A Github Account
2. Basic command line SSH skills
3. (optional, but easier to follow this) A MODX Cloud account

## Getting Started with Collaboration

For the purpose of this tutorial, we’re assuming you will use MODX Cloud. 

Start by creating a blank MODX instance using the latest version. You’ll also need to [`ssh` into your site](https://support.modx.com/hc/en-us/articles/217294267-Access-Instances-with-SFTP-SSH) to set up [Gitify](https://github.com/modmore/Gitify). 

Gitify brings a two-way sync of data typically stored in the MODX database, making it versionable with Git, and thus much easier to collaborate on with a team.

### Step 1: Create a Blank Site and Install Composer and Gitify

Once the instance is created, `ssh` into it and execute the following commands. This will install Composer and get Gitify cloned to your site:

```
cd www
curl http://modx.co/scripts/install.sh | sh
cd ~ 
mkdir gitify
git clone https://github.com/modmore/Gitify.git ./gitify/
```

Now exit the SSH session, and log back in so you can use Composer.

TODO: `source …` command so you don't have to logout/login each time

### Step 2: Set up Gitify

From an SSH connection in the Cloud home directory:

```
cd www/gitify
composer install
chmod +x Gitify
cd ~/.bin
ln -s ../gitify/Gitify gitify
```

Again, log out of the SSH session so you use Gitify.

### Step 3: Clone the repo of a shared Theme to your Github account

Fork a Theme to your own Github account for sharing. For the purposes of this tutorial, we’ll use the Starter Theme for Fred—a Bootstrap 4 based theme with many common patterns already created as elements. To get the URL to clone, from Github click the down-arrow on the green `Clone or download` button and choose the SSH URL, like `git@github.com:modxcms/fred-theme-starter.git`

### Step 4: Clone the Shared Theme

Because you cannot `git clone` into a directory with anything in it, we’ll use a temporary location and move the shared theme. To get the URL to clone, from Github click the down-arrow on the green `Clone or download` button and choose the SSH URL, like `git@github.com:modxcms/fred-theme-starter.git`

```
cd www
git clone git@github.com:modxcms/fred-theme-starter.git tmp
```

This will download the theme repository into a `~/tmp/` directory in the Cloud. Next, move the cocntents of `tmp/` to the correct location under `www/` so it can be loaded into your local MODX installation:

```
mv -rf tmp/* www/*
```

Make sure the `.git/` directory and files are move under `www/`.

### Step 5: Load the Theme using Gitify

Now it's time to load the theme into the Manager:

```
cd ~/www/
gitify package:install --all
gitify build
```

You should see a message like `{{message here}}` if this is successful.

### Step 6: Login to the Manager to make sure things worked

TODO: @anyone 

## Working with Gitify

A common purpose of collaborating on a Theme will be to build a series of Elements, Option Sets, and RTE Configs.

Once you’ve installed and worked on a Theme with a team, you’ll find yourself needing to do some common things:

### Get the latest contributions from your collaborators

TODO: @theboxer

### PUsh your changes back to your collaborators

TODO: @theboxer
