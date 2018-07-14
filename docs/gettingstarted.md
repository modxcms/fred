# Getting Started

To use Fred, you'll need to set up a few things before you can start creating content.

1. Install [Fred from MODX.com](https://modx.com/extras/package/fred)
2. Set up a template with the content dropzone
3. Create a category structure to hold your elements
4. Instruct Fred to activate on your template and to use your categories
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

## Step 3: Create the category structure for your elements

Before you can start adding elements, you'll need some elements!

Fred structures elements into categories, two levels deep. You first need a container category. That category will then have any number of subcategories that will contain your actual elements.

For example, your category structure could look like this:

- Fred Elements
    - Text
    - Images
    - Widgets
    
Within the "Text", "Images" and "Widgets" categories you will create Chunks that act as the unique element types available to your content builder. 

For now, create a "Fred Elements" category and at least one subcategory, for example "Text", and let's move on to tell Fred where to look.

## Step 4: Instruct Fred to use your template and categories

Now that we've created the basic template and our category structure, let's tell Fred about it!

Go to System > System Settings in MODX and select Fred in the namespace dropdown (the one that defaults to "core"). There are a number of options available to you here, but we're most concerned with the following 2:

- Set `fred.template_ids` to the ID of the template you added the dropzone to in step 2
- Set `fred.elements_category_id` to the ID of the root category you created to hold the subcategories and elements. This is the one with the name "Fred Elements" in our example. To find the category ID, look under Elements > Categories, the ID is the number between brackets there.

Now you should be able of visiting a resource that uses your template from step 2 and see either the "Open in Fred" button (in the manager), or the Fred launcher in the bottom left of the page (in the frontend). That tells us we're on the right path, now we need to create some elements.

## Step 5: Create your first elements

Let's start by creating a heading element, often the first thing on a page. 

Create a chunk in the Fred Elements > Text category with name `heading`. Give it the following content:

    <h1 contenteditable="true" data-fred-name="heading">Hello, world.</h1>

For the description, add: 

    image:https://placehold.it/300x150&text=Heading

You can read more about the description field in the Elements > Setting documentation, for now just trust that it's a good idea to add that option.

Save your chunk and go back to the frontend of your resource, refreshing the page.

Click on the orange elements icon or the MODX icon in the launcher at the bottom left of the page. In the Elements tab of the sidebar, you should see the subcategories you created earlier in step 3. Hover over the Text category to see your Heading element, and drag it into the empty content. 

Congratulations, you just added your first element to a page!

Now that it's in place, you can click on it to edit its text. By hovering over an element you'll see an additional toolbar that lets you duplicate, delete, or move the element on your page. 

Let's create another element for simple text. Create a chunk under Fred Elements > Text with the name `paragraph`, `image:https://placehold.it/300x150&text=Paragraph` as description, and `<p contenteditable="true" data-fred-name="paragraph">Your content goes here.</p>` as content. Save, and refresh the frontend. Try inserting your element and moving it across the page. 

## Learn more

Now that you have the basics of Fred working, you can learn more about the different types of elements you can create. These are all created as chunks, with special data attributes to indicate how they should be treated and saved. 
