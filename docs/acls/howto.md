# How to user Fred permissions

When you install Fred for the first time, Fred will add `Fred Admin` policy to every single context for your `Administrators` user group. Any member of your Administrators user group with Role `Super User` will have complete access to Fred, in manager and in all frontend contexts.

If you want to change this, or you need to give permissions to someone else, you can either adjust the Administrators user group or create your own.

When you create a new user group, you'll need to assign `Fred Editor` or `Fred Admin` policy to specific contexts. If you want your user to be able to access Fred from manager (requires other policies to give the user manager access) you'll assign one of the Fred policies to `mgr` context. If you want your users to be able to use fred from frontend (for example your `web` context), you assign one of Fred policies to the `web` context.

## Creating own Fred policy
The built in Fred Policies may not be sufficient for everyone. Fortunately it's simple enough to create your own Fred Policy and start using it.

In MODX Revolution head out to the ACLs menu and switch to Access Policies tab. Click the `Create Access Policy` button, fill the policy name and select `Fred` as a Policy Template. When you save the policy, it'll appear in the table, right click it and select `Update Policy`. You'll see a list of all [permissions](/acls/permissions), simply uncheck those you want to revoke access for the users.
