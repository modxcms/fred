const Tools = tinymce.util.Tools;
const TreeWalker = tinymce.dom.TreeWalker;
const RangeUtils = tinymce.dom.RangeUtils;

const getSelectedElements = function (rootElm, startNode, endNode) {
    let walker, node;
    const elms = [];

    walker = new TreeWalker(startNode, rootElm);
    for (node = startNode; node; node = walker.next()) {
        if (node.nodeType === 1) {
            elms.push(node);
        }

        if (node === endNode) {
            break;
        }
    }

    return elms;
};

const unwrapElements = function (editor, elms) {
    Tools.each(elms, function (elm) {
        editor.dom.remove(elm, true);
    });

    editor.selection.collapse();
};

const isLink = function (elm) {
    return elm.nodeName === 'A' && elm.hasAttribute('href');
};

const getParentAnchorOrSelf = function (dom, elm) {
    const anchorElm = dom.getParent(elm, isLink);
    return anchorElm ? anchorElm : elm;
};

const getSelectedAnchors = function (editor) {
    let startElm, endElm, rootElm, anchorElms, selection, dom, rng;

    selection = editor.selection;
    dom = editor.dom;
    rng = selection.getRng();
    startElm = getParentAnchorOrSelf(dom, RangeUtils.getNode(rng.startContainer, rng.startOffset));
    endElm = RangeUtils.getNode(rng.endContainer, rng.endOffset);
    rootElm = editor.getBody();
    anchorElms = Tools.grep(getSelectedElements(rootElm, startElm, endElm), isLink);

    return anchorElms;
};

export const unlinkSelection = function (editor) {
    unwrapElements(editor, getSelectedAnchors(editor));
};

export default unlinkSelection;
