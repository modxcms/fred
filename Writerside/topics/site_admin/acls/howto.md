# Permissions Overview

When installing Fred the first time, it adds a `Fred Admin` policy to all contexts for the `Administrators` User Group. This policy enables any member with a `Super User`  Role full access to Fred both in the Manager and in all front-end Contexts.

It also creates a more-limited `Fred Editor` policy intended for users that do not need to set up Fred. Setting up Fred involves creating new Elements, Option Sets, and other admin functions.

## Limiting Fred to Specific Contexts

By default, the `Fred Admin` policy applies to all existing Contexts. If you do not need to manage all Contexts with Fred remove this Policy from the `Administrators` User Group; if you create a new Context that needs to be managed by Fred add this policy to the `Administrators` Group after creating the Context.

To enable Fred for members who are not `Administrators` Group members, add a Fred Policy to their User Group and to the specific Contexts you wish to be managed by Fred.

## Manager and Front-end Access

Web developers and theme creators use the Fred Extra in the Manager to configure Fred and create Themes. Once a site is set up, however, daily content creation and edits using Fred may not require Manager access.

If you wish for users to only work with Fred from the front-end, you need to take two steps:

1. Install the [Login Extra](https://modx.com/extras/package/login) to add a front-end login for content authors and editors.
2. Assign one of the Fred Policies to the `web` or other Contexts.

## Creating Custom Fred Policies

The built-in Fred Policies may not be sufficient for all sites. Fortunately, creating custom Fred Policies is straightforward.

1. In the Manager, select the ACLs menu under the gear icon in the upper right.
2. Click the Access Policies tab.
3. Click the `Create Access Policy` button, fill the policy name and select `Fred` as the Policy Template. This Policy Template contains all the possible permissions you need to customize how you configure it for your users.
4. When you save the policy, it appears in the table. Right-click it and select `Update Policy` from the contextual menu.
5. Enable or disable the [permissions](permissions.md) by unchecking the ones you wish to restrict from your users.
