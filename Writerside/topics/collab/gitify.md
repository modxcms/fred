# Setting up Gitify

[Gitify](https://github.com/modmore/Gitify) brings two-way sync of data typically stored in the MODX database, making it versionable with git. It acts as a CLI tool, like Composer, for working with MODX.

While this document may seem intimdating at first, it really is a simple copy/paste command line exercise. Things you’ll need to access or be familiar with:

1. A Github Account
2. Basic command line SSH skills
3. (optional, but easier to follow this) A MODX Cloud account, or a host that supports git

## Getting Started

For the purpose of this tutorial, we’re assuming you will use MODX Cloud.

Start by creating a blank MODX instance using the latest version. You’ll also need to [`ssh` into your site](https://support.modx.com/hc/en-us/articles/217294267-Access-Instances-with-SFTP-SSH) to set up Gitify.

### Step 1: Install Composer and Gitify

Once the instance is created, `ssh` into it and execute the following commands starting in the home directory. This will install Composer and copy Gitify to your site.

```bash
cd www; curl http://modx.co/scripts/install.sh | sh
mkdir ../gitify; cd ../gitify
git clone https://github.com/modmore/Gitify.git ./
```

Now exit the SSH session, and log back in so you can use Composer. Alternately, you can use a command like `source /paas/cXXXX/.profile`, replacing the `cXXXX` with your actual Cloud directory.

### Step 2: Set up Gitify

From an SSH connection in the Cloud home directory:

```bash
cd ~/gitify
composer install
chmod +x Gitify; cd ~/.bin; ln -s ../gitify/Gitify gitify
```

After the `composer install` command you can confirm things worked if you see a green line of text that says “Generating autoload files”. Again, log out of the SSH session so you use Gitify, or use the `source…` command above.

### Step 3: Get the Clone URL

For the purposes of this tutorial, we’ll use a hypothetical (but non-existant) Example Theme. To get the URL to clone, on github.com find the repository you wish to work on, and click the down-arrow on the green `Clone or download` button and choose the SSH URL, like `git@github.com:modxcms/example.git`

To start a new Theme project, see the [Setting up a Theme to work with Gitify](initial_extract.md) guide.

### Step 4: Clone the Shared Theme to your MODX Instance

Because you cannot `git clone` into a directory with anything in it, we’ll use a temporary location and move the files to the web root. To get the URL to clone, click the down-arrow on the green `Clone or download` button on a Theme Github project and copy the SSH URL which looks like `git@github.com:modxcms/fred-theme-starter.git`

```bash
cd ~/www
git clone git@github.com:modxcms/fred-theme-starter.git tmp
```

This will download the theme repository into a `~/www/tmp/` directory in the Cloud. Next, move the contents of `tmp/` to the correct location under `www/`:

```bash
rsync -av ./tmp ./
```

Make sure the `.git/` directory and files are move under `www/`. Once you confirm things are in the right place, go ahead and remove `tmp/`:

```bash
rm -rf ./tmp
```

### Step 5: Load the Theme using Gitify

Now it’s time to load the Theme into your MODX instance. This will most likely include several Extras and take a a minute or longer depending on the speed of your connection. You’ll see messages about downloading and installing Extras during this process:

```bash
cd ~/www
gitify package:install --all
gitify build
```

You should see a green one-word message `Done!` if the installation is successful, and the same but with memory and timing stats if the build is successful.

### Step 6: Login to the Manager to view your Theme

When done you can log in to your Manager and see the Extras, including Fred, which were installed, and review the Elements, Bluprints and Options contained in the Theme.

## Next steps

Once you have cloned your theme to your MODX instance, you can work with a remote repository in [git to collaborate](gitify_in_action.md).
