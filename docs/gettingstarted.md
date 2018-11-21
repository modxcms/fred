# Getting Started

Setting up Fred involves a few requirements before you can use it to create content. The easiest way to start is to install a Theme exported from Fred which should include everything you need to succeed.

1. Install a [Fred Theme from the MODX Extras repository](https://modx.com/extras/browse/?search=fred) into your MODX website
2. Add a new page to your site using one of the Templates from the Fred theme and save the Page
3. Click the `Preview` button to visit this page from the front-end and start building with Fred

If you’re interested in creating Themes, it is also straightforward as outlined and detailed below:

1. Install [Fred from MODX.com](https://modx.com/extras/package/fred), and probably the [icon picker](https://modx.com/extras/package/fredfontawesome5iconeditor) and [TinyMCE RTE](https://modx.com/extras/package/fredtinymcerte), too
2. Set up a MODX Template with a content Dropzone
3. Assign this Template to a Fred theme
4. Create Categories for your Fred Elements
5. Create your first Fred Element

## Step 1: Install Fred

Fred is available as a transport package. In your MODX installation, go to `Extras` > `Installer` and click on the Download Extras button. Search to find bring up Fred. 

You should also see other Extras listed made for Fred, such as a Font Awesome icon picker and a TinyMCE RTE. If you decide to add these also, follow their setup instructions.

After your Fred Extras finish downloading, install them from the Packages grid. 

## Step 2: Set up a Template

Fred needs a “dropzone” to know where content can go, indicated by adding a `data-fred-dropzone` attribute to an HTML entity, often a `div` tag. For example, where the `[[*content]]` tag would normally be in a Template, add the following:

    <div data-fred-dropzone="content"  data-fred-name="content" data-fred-target="content">
        [[*content]]
    </div>

Note the value of the `data-fred-dropzone="content"` attribute indicates where to render your content once you save a page in Fred, in this case, the `[[*content]]`. Fred also supports multiple Dropzones; see the [templates documentation](/templates) for more information.

## Step 3: Assign a Template to a Fred Theme

1. In the MODX Manager, go to the `Extras` > `Fred` menu and switch to `Themed Templates` tab
2. Click the `Assign Theme to a Template` button
3. Select all Templates you wish to use with this Fred Theme
4. Select the `Default` Theme
5. Click the `Save` button

In the Manager, Resources that use Templates assigned to a Fred Theme should have an "Open in Fred" button. From the front-end, you should see either three icons which launch Fred at the bottom-left of the page or a Fred sidebar. 

## Step 4: Create Categories for Elements

Fred organizes Elements using categories. Open the Elements Manager Page from the `Extras` > `Fred` > `Elements` menu, and switch to the `Categories` tab to create Categories. For example, your categories could look like this:

- Page Content
- Intros
- Images
- Testimonials
- …
    
Fred requires at least one Category before creating actual content Element.

## Step 5: Create your first elements

Fred Elements can be as simple as raw text or more complex like a  responsive product catalog detail page.  Let’s start by creating a simple heading element, often the first thing on a page. 

Switch to the `Elements` tab in Element's CMP (`Extras` > `Fred` > `Elements`) and click the `Create Element` button. Fill the name (`H1 Heading`), category (`Text`), image (`https://placehold.it/300x150&text=Heading`).

![Element Creation 3PC Screenshot]()

Add the following markup:

    <h1 contenteditable="true" data-fred-name="heading">Hello, world.</h1>

Save this Element, go back to the front-end of your Resource, and refresh the page.

Click on the orange Elements stacked boxes icon or the MODX icon in the launcher at the bottom left of the page. In the sidebar Elements tab, you should now see the categories you created earlier in step 4. Hover the `Text` category to see your freshly created `H1 Heading` Element and drag it into the empty dropzone.

![Front-end sidebar Screenshot]()

Congratulations, you just added your first Element to a page using Fred!

Select the placeholder “Hello, world.” text and start typing to edit its content. When hovering over an Element, you’ll see an additional toolbar that lets you duplicate, delete, or move the element on your page.  When you’re happy with the new page title, click the green checkbox button to save.

Let’s create another element for a single paragraph: 

1. Create an Element under same category with the name `Basic Paragraph`, `https://placehold.it/300x150&text=Paragraph` for the image, and `<p contenteditable="true" data-fred-name="paragraph">Your content goes here.</p>` for the markup
2. Save this in the Manager
3. From the front-end, reload the page
4. Drag this new Element beneath the previously created title, and drop it in place 
5. Change the text and save

![Front-end editing .gif animation]()

## Learn more

Now that you have the basics of Fred working continue reading the documentation to learn more about how Fred works. 
