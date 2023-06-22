import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  LabShell
} from '@jupyterlab/application';

import { NotebookPanel } from '@jupyterlab/notebook';
import { hintOverlay } from './utils';
/**
 * Initialization data for the etc_jupyterlab_hints extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'etc_jupyterlab_hints:plugin',
  description:
    'A JupyterLab extension that provides hint for University of Michigan Jupyter Notebook courses.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension etc_jupyterlab_hints is activated!');
    // const isActivated = false;
    const labShell = app.shell as LabShell;
    // if (!isActivated) {
    // isActivated = true;
    // console.log("I'm activated!");
    labShell.currentChanged.connect(() => {
      const notebook = app.shell.currentWidget as NotebookPanel;
      if (notebook) {
        notebook.revealed.then(() => {
          console.log('Notebook is revealed!');
          findHintCell(notebook);
        });
      }
    });
  }
};

const findHintCell = (notebook: NotebookPanel): void => {
  if (notebook.content.model) {
    const cellList = notebook.content.model.cells;
    for (let i = 0; i < cellList.length; i++) {
      if (cellList.get(i).metadata.hint) {
        // cellList.get(i).setMetadata('revealed', false);
        const cellElement = notebook.content.widgets.find(widget => {
          return widget.model === cellList.get(i);
        });
        console.log('CELL ELEMENT : ', cellElement);
        if (cellElement) {
          hintOverlay(cellList.get(i), cellElement.node, cellElement?.model.id);
        }
      }
    }
  }
};

export default plugin;
