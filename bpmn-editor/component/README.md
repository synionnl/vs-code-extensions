# BPMN editor

HTML5 web component which creates an BPMN editor for different execution engines:

- Vanilla BPMN
- Camunda Platform (Camunda 7)
- Camunda Cloud (Camunda 8, Zeebee)

## Usage

- Add `bpmn-editor.js` to the webpage
- Add the `<bpmn-editor></bpmn-editor>` to the page

## Attributes

### data-xml

An HTML escaped version of the BPMN xml.

## Events

### Changed

```html
<bpmn-editor id="editor"></bpmn-editor>

<script>
    document.getElementById("editor")
        .addEventListener("changed", (e) => {
            const xml = e.target.xml;
        })
<script>
```

## Examples

### HTML

```html
<bpmn-editor data-xml="...xml"></bpmn-editor>
```

### HTML and JavaScript

```html
<bpmn-editor id="editor"></bpmn-editor>

<script>
    document.getElementById("editor").xml = '...xml';
<script>
```
