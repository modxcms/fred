# Using Gitify to Collaborate with Pull Requests

Some projects will require you to submit a Pull Request (PR) to their repository. You do this by forking the repo, making changes in a feature branch in your fork, then submitting the PR to the original project.

For the purpose of this tutorial, we’ll be using the [Fred Starter Theme](https://github.com/modxcms/fred-theme-starter) as the `origin` theme that is intended to be a quickstart project for theme builders to use, based on Bootstrap 4. You will also need to be signed in to your Github account.

## 1. Fork a repository
Fork the repository you wish to contribute to on Github: For example, visit the [Fred Theme Starter](https://github.com/modxcms/fred-theme-starter) and click the `fork` button in the upper right. 

Click the down-arrow on the green `Clone or download` button on a source Github project and copy the HTTPS URL which looks like `https://github.com/modxcms/fred-theme-starter.git` for use later. You’ll also need your fork’s SSH URL, found in the same location, for example `git@github.com:your_username/your-fork-name.git`.

## 2. Clone the Shared Theme to your MODX Instance

Because `git clone` only works in empty directories, we’ll use a temporary `tmp/` directory and move the files to the web root when done. Open an SSH connection to your working Cloud instance and execute:

```
cd ~/www
git clone git@github.com:your_username/your-fork-name.git tmp
```

This will download the theme repository into a `~/www/tmp/` directory in the Cloud. Next, move the contents of `tmp/` to the correct location under `www/`:

```
rsync -av ./tmp ./
```

Make sure the `.git/` directory and files are moved under webroot `www/` directory. Once you confirm the files and directories are in the right place, go ahead and remove the `tmp/` directory with `rm -rf ./tmp`.

## 3. Add upstream (the original repository)

Use the original HTTPS clone URL from step 1 of this tutorial to set the remote upstream origin:

```
git remote add upstream https://github.com/modxcms/fred-theme-starter.git
```

## Sync the original master branch with your master branch

You should **NEVER** commit directly to master branch because _________. This step is important to do before you start any work.

```
git pull upstream master
git push origin master
gitify package:install --all
gitify build
```

## Push your changes to your Fork on Github

This section will get your local work to Github, where it can then be pushed as a PR to the original project.

```
cd ~/www
git checkout -b my-feature  # checkout to a new branch named `my-feature`, 
                            # or any other name you decide for your work
gitify extract              # extract all your changes
git add --all               # or git add only specific changed files
git commit -m "My Changes"  # Use a more reasonable commit message
git push origin my-feature  # push to your `my-feature` branch on Github
git checkout master
gitify package:install --all
gitify build
```

## Submit a PR to the origin project

Open your fork on Github. There should be a notification about creating a PR from newly created branch. Click that and submit the PR to the appropriate branch, most likely `master` or as specified in the original repository README.

