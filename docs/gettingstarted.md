# Getting Started

To use Fred, you'll need to set up a few things before you can start creating content.

1. Install [Fred from MODX.com](https://modx.com/extras/package/fred)
2. Set up a template with the content dropzone
3. Instruct Fred to use your template
4. Create the category structure for your elements
5. Create your first elements

## Step 1: Install Fred

Fred is available as a transport package. In your MODX installation, go to Extras > Installer and click on Download Extras. Find Fred through the search. 

You may also see other extras listed that are built to be used with Fred. When you decide to use these, you may need to set those up or integrate them with your elements separately.

Once downloaded, install Fred from the packages grid. 

## Step 2: Set up a template

Fred needs to know where your modular content has to go. It needs a container for that, which it calls a dropzone. 

Create a template (or update an existing one), and add the following to it where you would normally have the `[[*content]]` tag:


    <div data-fred-dropzone="content" style="min-height: 200px;">
        [[*content]]
    </div>

Note the `data-fred-dropzone="content"` attribute - that is required and needs to have a value of content. It tells Fred that this is your main content field and needs to be managed as such.

The `min-height` style is optional, but helps with making it easier to drop the first element into your content later.

## Step 3: Instruct Fred to use your template

Now that we've created the basic template, let's tell Fred about it!

- Go to Extras > Fred and switch to `Themed Templates` tab.
- Click the `Assign Theme to a Template` button
- Select all Templates you'll want to use with fred
- Select `Default` Theme
- Click `Save`

Now you should be able of visiting a resource that uses your template from step 2 and see either the "Open in Fred" button (in the manager), or the Fred launcher in the bottom left of the page (in the frontend). That tells us we're on the right path, now we need to create some categories and elements.

## Step 4: Create the category structure for your elements

Before you can start adding elements, you'll need some categories!

Fred structures elements into categories. Open Element's CMP (Extras > Fred > Elements), switch to `Categories` tab and create categories that will later contain your actual elements.

For example, your categories could look like this:

- Text
- Images
- Widgets
    
Later you'll create Elements and assign them to the "Text", "Images" or "Widgets" categories. 

For now, create at least one category, for example "Text", and let's move on to create some Elements.

## Step 5: Create your first elements

Let's start by creating a heading element, often the first thing on a page. 

Switch to the `Elements` tab in Element's CMP (Extras > Fred > Elements) and hit `Create Element` button. Fill the name (`heading`), category (`Text`), image (`https://placehold.it/300x150&text=Heading`) and use following Element's Markup:

    <h1 contenteditable="true" data-fred-name="heading">Hello, world.</h1>

Save your Element and go back to the frontend of your resource, refreshing the page.

Click on the orange elements icon or the MODX icon in the launcher at the bottom left of the page. In the Elements tab of the sidebar, you should see the categories you created earlier in step 4. Hover over the Text category to see your Heading element, and drag it into the empty content. 

Congratulations, you just added your first element to a page!

Now that it's in place, you can click on it to edit its text. By hovering over an element you'll see an additional toolbar that lets you duplicate, delete, or move the element on your page. 

Let's create another element for simple text. Create an Element under same category with the name `paragraph`, `https://placehold.it/300x150&text=Paragraph` as image, and `<p contenteditable="true" data-fred-name="paragraph">Your content goes here.</p>` as markup. Save, and refresh the frontend. Try inserting your element and moving it across the page. 

## Learn more

Now that you have the basics of Fred working, you can learn more about the different types of elements you can create. 
