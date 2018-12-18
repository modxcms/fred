# Using Gitify to Collaborate with Pull Requests

Some projects will require you to submit a Pull Request (PR) to their repository. You do this by forking the repo, making changes in a feature branch in your fork, then submitting the PR to the original project.

For the purpose of this tutorial, we’ll for the [Fred Starter Theme](https://github.com/modxcms/fred-theme-starter) which is intended to be a Bootstrap 4 quickstart for theme builders. Start by signing into Github.

## Fork and clone to a MODX instance

To start with PRs, you need to fork a repository and work on feature branches before you can submit PRs successfully.

### 1. Fork a repository
Fork the repository you wish to contribute to on Github: For example, visit the [Fred Theme Starter](https://github.com/modxcms/fred-theme-starter) and click the `fork` button in the upper right. 

Click the down-arrow on the green `Clone or download` button on a source Github project and copy the HTTPS URL which looks like `https://github.com/modxcms/fred-theme-starter.git` for use later. You’ll also need your fork’s SSH URL, found in the same location, for example `git@github.com:your_username/your-fork-name.git`.

### 2. Clone your fork to your MODX instance

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

### 3. Add the `upstream` remote

This is the original project. Use its HTTPS clone URL from step 1 of this tutorial to set the remote upstream:

```
git remote add upstream https://github.com/modxcms/fred-theme-starter.git
```

## Working with your fork

### Sync the original master branch with your fork

For the purposes of working with PRs, you should _never_ commit directly to your master branch; for more information see the [Feature Branches and Pull Requests: Walkthrough](https://gist.github.com/vlandham/3b2b79c40bc7353ae95a)  and [Understanding the GitHub flow](https://guides.github.com/introduction/flow/) guides. Before pushing any work to a feature branch, you should sync your local repository with the upstream:

```
git pull upstream master
git push origin master
gitify package:install --all
gitify build
```

The gitify commands are important to prevent overwriting any changes you’ve made.

### Push your changes to your fork

The following will get your local work to your Github fork, where it can then be pushed as a PR to the original project:

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

