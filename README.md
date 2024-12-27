# Podcast App Template

Share and manage your podcasts.

## Built with

- [Cloudflare Workers Assets](https://developers.cloudflare.com/workers/static-assets/): host the application
- [Cloudflare R2](https://developers.cloudflare.com/r2/): store audio and image files
- [Cloudflare D1](https://developers.cloudflare.com/d1/): store information of the podcast episode like title, description, transcript, etc.
- [Cloudflare Queues](https://developers.cloudflare.com/queues/): message queue to de-couple the transcription creation process off the main thread
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/): create transcription of the podcast episode
- [Remix](https://remix.run/docs): framework used to build the application

## How it works

This is a Podcast application that allows you to share and manage your podcast episodes. As an admin (`/admin`), you can add new podcast episodes, edit the existing episodes, and publish-unpublish these episodes. The episode audio and thubmnail file gets stored in [Cloudflare R2](https://developers.cloudflare.com/r2/). The project is configured to use [R2 Event notifications](https://developers.cloudflare.com/r2/buckets/event-notifications/) which sends a message to a [Cloudflare Queue](https://developers.cloudflare.com/queues/) when a new audio file gets added. The Queue uses [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) to generate the transcript of this audio file. All the information regarding the episode like title, description, published date, creation date, updation date, transcript, status (published, draft), duration, audio key, and thumbnail key are stored in a table in [Cloudflare D1](https://developers.cloudflare.com/d1/).

A user can view the episodes, and listen to the episode of their choice.

## Develop locally

Use this template with [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the create-cloudflare CLI):

```sh
npm create cloudflare@latest -- --template=cloudflare/templates/podcast-app-template
```

Rename `.dev.vars.example` to `.dev.vars` and update the values.

## Preview Deployment

A live public deployment of this template is available at 