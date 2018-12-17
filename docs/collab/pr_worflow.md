# Using Gitify to Collaborate on Themes

### Fork a repository
Find a repository you want to contribute, for example [Fred Theme Starter](https://github.com/modxcms/fred-theme-starter) and hit the `fork` button.

Note the original URL in HTTPS version (in this case it is `https://github.com/modxcms/fred-theme-starter.git`) and fork's URL in git version for example `git@github.com:your_username/your-fork-name.git`.

### Clone the Shared Theme to your MODX Instance

Because you cannot `git clone` into a directory with anything in it, we’ll use a temporary location and move the files to the web root. To get the URL to clone, click the down-arrow on the green `Clone or download` button on a Theme Github project and copy the SSH URL which looks like `git@github.com:modxcms/fred-theme-starter.git`

```
cd ~/www
git clone git@github.com:your_username/your-fork-name.git tmp
```

This will download the theme repository into a `~/www/tmp/` directory in the Cloud. Next, move the contents of `tmp/` to the correct location under `www/`:

```
rsync -av ./tmp ./
```

Make sure the `.git/` directory and files are move under `www/`. Once you confirm things are in the right place, go ahead and remove `tmp/`:

```
rm -rf ./tmp
```

### Add upstream (the original repository)
```
git remote add upstream https://github.com/modxcms/fred-theme-starter.git
```

### Sync original master branch with your master branch
You should **NEVER** commit directly to master branch. This step is important to do before you start any work.
```
git pull upstream master
git push origin master
gitify package:install --all
gitify build
```

### Pushing your changes
```
cd ~/www
git checkout -b my-feature # checkout to new branch, use whatever name make sense
gitify extract # extract all your changes
git add --all # or git add on changed files
git commit -m "My Changes" # Use reasonable commit message
git push origin my-feature # push to my-feature branch
git checkout master
gitify package:install --all
gitify build
```

### PR
Open your fork in github. There should be a notification about creating a PR from newly created branch. Click that and submit the PR to the appropriate branch (most likely to master, or follow guide of the original repository).

---
Leaving all other text here in case you want to reuse any of it :) 

TODO: @theboxer review all the things!

You mist have [Gitify set up](collab/gitify) with your theme in order to follow these instructions.

### Step 3: Fork a shared Theme to your Github account

Fork a Theme to your own Github account for sharing. For the purposes of this tutorial, we’ll use the Starter Theme for Fred—a Bootstrap 4 based theme with many common patterns already created as elements. To get the URL to clone, from Github click the down-arrow on the green `Clone or download` button and choose the SSH URL, like `git@github.com:modxcms/fred-theme-starter.git`


## Working with Gitify

A common purpose of collaborating on a Theme will be to build a series of Elements, Bluepints, Options, and RTE Configs.

Once you’ve installed and worked on a Theme with a team, you’ll find yourself needing to do some common things:

### Get the latest contributions from your collaborators

TODO: @theboxer … this section needs more explanation/clarification for git CLI newbies.

For the purposes of this tutorial, our theme will only have one branch in Git (master). As such, you’ll need to set the remote branch for future git commands:

```
git branch --set-upstream-to=origin/master
```

When all your changes are pushed to the local repository you’re working on: 

```
cd ~/www
git pull
gitify package:install --all
gitify build
```

If you have changes in your instance, perform the following. You’ll see messages about Extracting various Fred-related things:

```
cd ~/www
gitify extract
git add --all # or git add on files you want to commit
git commit -m "Your commit message here" # please write your own message!
git pull
# resolve conflicts if any
gitify package:install --all
gitify build
```

#### Working with `git` from the command line

If you're not familiar with Vi or Vim, chance are you’ll be lost when creating the commit message. You can make commits without specifying the message, which puts you into a Vi editor. The benefit of this is that you get to review what all will be pushed. 

Here are a few pointers:  

- Write the commit title on the first line. A more detailed description can go on subesequent lines.
- Things with a `#` in front will be ignored. 
- When you’re done, press the `esc` key then type `:wq` to exit.
- If you really get stuck, it is Vi after all, [StackExchange to the rescue]()!

### Push your changes back to your Github repository
If you are **not** going to submit PR:

```
cd ~/www/
gitify extract
git add --all # or git add only the files you wish to commit
git commit -m "Your commit message here" # please write your own message!
git push origin master # replace master with branch name you want to push into
```

If you are going to submit PR:
```
cd ~/www/
git checkout -b branch-name # use whatever branch name that make sense
gitify extract
git add --all # or git add only the files you wish to commit
git commit -m "Your commit message here" # please write your own message!
git push origin branch-name # replace master with branch name you created
```

## Submit a Pull Request (PR) to the main Project

Open your repository in GitHub, click `New Pull Request` button, select branch you pushed into from your repository and appropriate branch (most likely master) in the target repository.