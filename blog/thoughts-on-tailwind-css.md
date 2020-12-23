---
title: 'Thoughts on Tailwind.css'
excerpt: 'Some things I like and dislike about Tailwind.css'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

I'm not sold on the utility class names, and don't think I ever will be. While I agree with some of the points favouring utiltiy classes, there are other points that need to be considered:

## Abstractions

Abstractions allow us to "package" complicated concepts into high-lever concepts to make them easier to manage when building complex systems.

When building a complicated user interface I need to understand the purpose of components at a glance without having to understand the details or implementation of those components to understand their purpose.

Let's look at some example tailwind code for a modal:

```html
<div class="fixed z-10 inset-0 overflow-y-auto">
  <div
    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
  >
    <div class="fixed inset-0 transition-opacity">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
      >&#8203;</span
    >
    <div
      class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
    >
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <svg
              class="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Deactivate account
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Deactivate
        </button>
        <button
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>
```

While the purpose of some of the HTML elements is obvious (eg buttons), it's not clear the purpose or responsibility of the other HTML elements are. If I need to make some adjustments to this modal I would struggle, as to me this is a mess of HTML and CSS classes and I need to grok the styles AND use my browser developer tools to understand the purpose of the HTML elements. What is the dialog, what is the backdrop/overlay etc? I don't know!

If we used semantic classes, grokking this modal would be so much easier:

```html
<div class="modal-container">
  <div class="modal">
    <div class="overlay">
      <div class="overlay-bg"></div>
    </div>
    <span class="spacer">&#8203;</span>
    <div class="dialog">
      <div class="dialog-body">
        <div class="icon-container">
          <div class="icon">
            <svg
              class="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div class="dialog-content">
            <h3 class="dialog-title">Deactivate account</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <button type="button" class="button-primary">Deactivate</button>
        <button type="button" class="button-secondary">Cancel</button>
      </div>
    </div>
  </div>
</div>
```

While I'm happy for my perspective to change, I personally feel that readability is very important and I'm not sold on utility classes.

## Code Reviews

Spot the difference between:

```html
<button
  type="button"
  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
>
  Cancel
</button>
```

and:

```html
<button
  type="button"
  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
>
  Cancel
</button>
```

Not easy right? Ok let's try it with a GitHub diff:


## How I use tailwind.css

Although the main selling point of Tailwind.css is the utiltiy classes, tailwind provides much more. I'm using tailwind as a style system that providing themes and utitilities for generating consistent styles. That's all I use tailwind for. I still build semantic classes, but I use tailwind to do so.

For example, here's a very basic Dialog component:

```ts
import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Dialog.module.css';
const classes = classNames.bind(STYLES);

export interface DialogProps {
  onClose: () => void;
}

export const Dialog: React.FunctionComponent<DialogProps> = ({
  onClose,
  children,
}) => {
  return (
    <div className={classes('root')} role="dialog">
      <div className={classes('header')}>
        <button
          type="button"
          className={classes('close-button')}
          onClick={onClose}
        >
          X
        </button>
      </div>
      <div className={classes('body')}>{children}</div>
    </div>
  );
};
```

And here's the corresponding styles:

```css
.root {
  @apply flex
    flex-col
    bg-white
    rounded-lg
    text-left
    overflow-hidden
    shadow-xl
    transform
    transition-all
    sm:align-middle
    sm:max-w-6xl
    sm:max-h-full
    mx-auto
    my-10;
}

.header {
  @apply absolute
    z-10
    right-2
    top-4
    px-4
    py-3
    sm:px-6
    sm:flex
    sm:flex-row-reverse;
}

.close-button {
  @apply mt-3
    w-full
    inline-flex
    justify-center
    rounded-md
    border
    border-gray-300
    shadow-sm
    px-4
    py-2
    bg-white
    text-base
    font-medium
    text-gray-700
    hover:bg-gray-50
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-indigo-500
    sm:mt-0
    sm:ml-3
    sm:w-auto
    sm:text-sm;
}

.body {
  @apply bg-white
    mx-4
    mt-5
    mb-4
    sm:m-6
    overflow-hidden
    relative
    h-full;
}
```
