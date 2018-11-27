# Luizalian Web

This project contains the HTML/JS/CSS source code for luiza lian site in 2018.
It's built using [hugo](http://gohugo.io) as a static site generator,
[webpack](https://webpack.js.org/) for javascript compilation,
and [postcss](https://github.com/postcss/postcss) as a CSS DSL tool.

It's also a pure javascript project, using `npm`.

    - To build for production: `npm run build`
    - To build for previewing (drafts): `npm run build-preview`
    - To develop locally: `npm run start`

# Site Contents

To include new pages, edit `site/content` folder using hugo markdown syntax.
Any new pages under root will be included under the dynamic `nav menu`.

** Don't forget to run `build` anytime you included/edited markdown files **

As 2018, the archetypes are:

    + Page, Blog
    + Album
    + Contact
    + Agenda

Using this routes:

    | (latest_album)
    +--> albums
    +       /oyatempo
    +       /*
    +--> contact
    +--> agenda

The layouts are stored under `theme/lulian`, and follow `hugo` layouts convention.
`baseof` is the skeleton of site, and each archetype has it's own layout( for eg: Album),
where the specific html, css and js for each page is loaded.

# Deploy & Continuous Integration

The site is generated using `npm run build`, and the output is just plain files stored
in the `docs` folder. Transfer all files from `docs` to your webserver and you're ready
to go.