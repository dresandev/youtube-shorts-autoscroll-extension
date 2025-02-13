(function () {
  const $ = (selector) => document.querySelector(selector);

  const BUTTON_ID = "d-auto-scroll-button";
  const NEXT_SHORT_BUTTON_ID = "navigation-button-down";
  const SHORTS_CONTAINER_ID = "shorts-inner-container";
  const VALID_URL = "https://www.youtube.com/shorts/";
  let autoscroll = false;

  if (!window.location.href.startsWith(VALID_URL)) return;

  const removeLoopAttrObserver = new MutationObserver((mutations) => {
    mutations.forEach(({ type, attributeName, target }) => {
      if (type === "attributes" && attributeName === "loop") {
        target.removeAttribute("loop");
      }
    });
  });

  function addButton() {
    if ($(`#${BUTTON_ID}`)) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.title = "Activar/Desactivar pasar automáticamente";
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 8l-.117 .007a1 1 0 0 0 -.883 .993v1.999l-2.586 .001a2 2 0 0 0 -1.414 3.414l6.586 6.586a2 2 0 0 0 2.828 0l6.586 -6.586a2 2 0 0 0 .434 -2.18l-.068 -.145a2 2 0 0 0 -1.78 -1.089l-2.586 -.001v-1.999a1 1 0 0 0 -1 -1h-6z" />
        <path d="M15 2a1 1 0 0 1 .117 1.993l-.117 .007h-6a1 1 0 0 1 -.117 -1.993l.117 -.007h6z" />
        <path d="M15 5a1 1 0 0 1 .117 1.993l-.117 .007h-6a1 1 0 0 1 -.117 -1.993l.117 -.007h6z" />
      </svg>
    `;

    button.addEventListener("click", () => {
      autoscroll = !autoscroll;
      button.classList.toggle("active");

      if (!autoscroll) return;

      const $playingVideo = $(`#${SHORTS_CONTAINER_ID} [is-active] video`);
      if (!$playingVideo) return alert("Posiblemente el selector cambió");

      setupVideo($playingVideo);
    });

    document.body.appendChild(button);
  }

  function setupVideo(video) {
    video.removeAttribute("loop");
    removeLoopAttrObserver.observe(video, { attributes: true });

    video.addEventListener("ended", () => {
      if (autoscroll) playNextShort();
      removeLoopAttrObserver.disconnect();
    }, { once: true });
  }

  async function playNextShort() {
    const $nextShortButton = $(`#${NEXT_SHORT_BUTTON_ID} button`);
    if (!$nextShortButton) return alert("Posiblemente el selector cambió");

    $nextShortButton.click();

    setTimeout(() => {
      const $newVideo = $(`#${SHORTS_CONTAINER_ID} [is-active] video`);
      if ($newVideo) setupVideo($newVideo);
    }, 100);
  }

  function removeButton() {
    $(`#${BUTTON_ID}`)?.remove();
  }

  const urlChangeObserver = new MutationObserver(() => {
    window.location.href.startsWith(VALID_URL)
      ? addButton()
      : removeButton();
  });

  urlChangeObserver.observe(document.body, { childList: true, subtree: true });

  // addButton();
})();
