import { IJupyterLabPioneer } from 'jupyterlab-pioneer';
import { NotebookPanel } from '@jupyterlab/notebook';

export const hintOverlay = (
  cell: any,
  node: HTMLElement,
  id: string,
  notebook: NotebookPanel,
  pioneer: IJupyterLabPioneer
) => {
  const overlay = document.createElement('div'); // Overlay div to blur out the hint cell
  const modal = document.createElement('div'); // Modal to confirm if user wants to reveal hint

  // If overlay already exists or cell is already revealed, return
  if (document.getElementById(`hint-overlay-${id}`) || cell.metadata.revealed) {
    return;
  }

  // Create hint blur overlay and append to hint cell node
  overlay.id = `hint-overlay-${id}`;
  node.appendChild(overlay);
  overlay.style.position = 'absolute';
  overlay.style.display = 'grid';
  overlay.style.placeItems = 'center';
  overlay.style.cursor = 'pointer';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.zIndex = '100';
  overlay.style.width = '102%';
  overlay.style.height = '100%';
  overlay.style.borderRadius = '3px';
  overlay.innerText = 'Click to reveal hint';
  overlay.style.fontWeight = '500';
  overlay.style.fontSize = '1rem';
  overlay.style.backdropFilter = 'blur(3px)';
  overlay.style.transition = 'all 0.25s ease-in-out';

  // Create modal to confirm if user wants to reveal hint
  modal.style.position = 'absolute';
  modal.style.width = '100%';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.padding = '20px';
  modal.innerText = 'Are you sure you want to reveal the hint?';
  modal.style.fontWeight = '500';
  modal.style.fontSize = '0.8rem';
  modal.style.textAlign = 'center';

  // Set overlay to be transparent when user hovers over it
  overlay.addEventListener('mouseover', () => {
    overlay.style.boxShadow = '0px 0px 5px 2px rgba(0,0,0,0.75)';
  });
  overlay.addEventListener('mouseout', () => {
    overlay.style.boxShadow = 'none';
  });

  // Remove overlay text and append modal when user clicks on overlay
  overlay.addEventListener('click', () => {
    overlay.innerText = '';
    overlay.appendChild(modal);
  });

  // Set cell metadata to revealed and remove overlay and modal and save the notebook
  modal.addEventListener('click', () => {
    cell.setMetadata('revealed', true);
    overlay.remove();
    modal.remove();
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 's', keyCode: 83, ctrlKey: true })
    );

    const event = {
      eventName: 'HintRevealedEvent',
      eventTime: Date.now()
    };
    const exporters = notebook.content.model?.getMetadata('exporters');
    exporters?.forEach(async (exporter: any) => {
      await pioneer.publishEvent(notebook, event, exporter, false);
    });
  });
  // overlay.style.backgroundColor = '#222';
  console.log('OVERLAY: ', overlay);
  console.log('NODE IN AFTER OVERLAY: ', node);
};
