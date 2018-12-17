# Using Gitify to Collaborate on Themes

You mist have [Gitify set up](collab/gitify) with your theme in order to follow these instructions.

## Working with Gitify and Git

A common purpose of collaborating on a Theme will be to build a series of Elements, Bluepints, Options, and RTE Configs.

For the purpose of this tutorial, we’ll assume all users can commit directly to the master repository. If you need to set up a respository for collaboration, see [Setting up a Theme to work with Gitify](collab/initial_extract). 

### 1. Push your Changes or Pull the Lastest

It’s critical to make sure that you don’t lose work when collaborating with a team. To prevent accidental overwrites, always perform the following before pulling from or pushing to the orign repository.

```
cd ~/www
gitify extract
git status
```

The `gitify extract` command will sycn your current Fred Theme to the filesystem. The `git status` command will tell you if you have changes that need to be committed. 

### 2. Commit changes to your local repo

This step and step 4 below can be skipped if ther are no changes to commit. 

If you do have changes, first commit them to your local repository before continuing:

```
git add --all  # or git add on files you want to commit
git commit -m "Your commit message here"  # please write your own message
```

### 3. Pull the latest contributions from your collaborators

Now it is time to sync all the latest updates from the upstream origin repository. From webroot, enter the following command: 

```
git pull origin master
```

This may result in conflicts that will be noted. If there are conflicts, they must be resolved before you can continue. A conflict happens when two people change the same line of code. For information on resolving conflicts, please see [Github’s guide to resolving conflicts](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/). 

Once you resolve conflicts, or after you have pulled from the origin, build the changes and make sure everything is functioning as expected in MODX:

```
gitify package:install --all
gitify build
```

### 4. Push your changes to the origin repository to share with collaborators

If you are only pulling remote changes, skip this step as in step 2 above.

Now you can safely push your changes. You’ll see messages about Extracting various Fred-related things. If you delay pushing your changes, you may see an error message about (new) conflicts due to other collaborators pushing changes before you:

```
git push origin master
```

You have now successfully worked with a team to build a theme. If you need to collaborate using PRs, like for the Fred Starter Theme available as a demo from MODX, please see the [Pull Request Git Workflow](collab/pr_workflow) guide.