# Pagination React DynamoDB

This is a reference project which implements:

-   Organization Strategy
    -   pages have containers
    -   containers make use of custom hooks for business logic
    -   containers make use of presentation components for UI
    -   hooks are tested by mounting them in a test component and testing them with react-testing-library
    -   component development is aided by storybook
    -   full workflows are testing using Cypress (still a work in progress)

Example project stucture:

```
/docs/
    ...generated docs
/cypress
    /integration
        itworks.js
/pages
    /Notes
        /components
            ComponentA.js
            ComponentA.stories.js
        /hooks
            hookA.js
            hookA.test.js
            hookA.example.js
        Container.js
        PresentationLoading.js
        PresentationError.js
        PresentationSuccess.js
amplify.yml
```

# Tools and Conventions

-   jest and react-testing-library for testing logic and functionality
-   storybook for visually aiding devs in building components
-   jsdocs for generating documentation
-   cypress for integration testing
-   amplify.yml for defining CICD pipeline
-   AWS Amplify for running a CICD pipeline, and deploying

# NPM Commands

-   `npm run docs` - generates docs
-   `npm run test-unit` - runs jest tests
-   `npm run test-int` - runs cypress tests (WIP)
-   `npm run storybook` - runs storybook locally

# Deployed URLS

-   Documentation (not yet deployed)
-   Storybook (not yet deployed)
-   App (not yet deployed)
