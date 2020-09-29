<div align="center">
  <img src="static/logo.png" alt="Zendesk Apps">
  <h1>Zendesk App</h1>
  <h3>A Zendesk App for System76</h3>
  <br>
  <br>
</div>

---

This repository contains a nuxt site used as a
[zendesk app](https://developer.zendesk.com/apps)
that enhance the workflow for System76 employees working in Zendesk. While this
repository is open source, the application are very specific to our work flow
and will be of no use in other people's instance of Zendesk. We keep this
repository open in hopes people can see, learn, and possibly enhance how we
create these apps.

## Requirements

- A recent version of `node`

## Setup

Simply `cd` into the app you are interested in and run `npm ci` to install
the dependencies.

You will also want to add the app you are working on to a zendesk instance. At
System76, we have a staging instance of Zendesk that we do all of our testing
on.

## Running

TODO

## Deployment

For the main app, everything is deployed on push to `master` or `staging`
branch, just like our other repositories.

To deploy the Zendesk app, you will need the
[Zendesk App Tools](https://developer.zendesk.com/apps/docs/developer-guide/zat)
installed. Next, just `cd` into the `zendesk` folder, run `zat package`, and
upload that package to Zendesk.

## License

This project is licensed under GPL-3.0. See [LICENSE](LICENSE) for more
information.
