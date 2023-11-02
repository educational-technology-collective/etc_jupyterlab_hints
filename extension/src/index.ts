import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  LabShell
} from '@jupyterlab/application';

import { NotebookPanel } from '@jupyterlab/notebook';
import { IJupyterLabPioneer } from 'jupyterlab-pioneer';
import { hintOverlay } from './utils';
/**
 * Initialization data for the etc_jupyterlab_hints extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'etc_jupyterlab_hints:plugin',
  description:
    'A JupyterLab extension that provides hint for University of Michigan Jupyter Notebook courses.',
  autoStart: true,
  requires: [IJupyterLabPioneer],
  activate: (app: JupyterFrontEnd, pioneer: IJupyterLabPioneer) => {
    console.log('JupyterLab extension etc_jupyterlab_hints is activated!');

    const labShell = app.shell as LabShell;

    // on notebook open or change event
    labShell.currentChanged.connect(() => {
      const notebook = app.shell.currentWidget as NotebookPanel;
      if (notebook) {
        notebook.revealed.then(() => {
          // once the notebook is revealed, find the hint cell
          findHintCell(notebook, pioneer);
        });
      }
    });
  }
};

const findHintCell = (
  notebook: NotebookPanel,
  pioneer: IJupyterLabPioneer
): void => {
  if (notebook.content.model) {
    const cellList = notebook.content.model.cells;

    // loop through all cells
    for (let i = 0; i < cellList.length; i++) {
      if (cellList.get(i).metadata.hint) {
        // if the cell is a hint cell, find the corresponding cell element
        const cellElement = notebook.content.widgets.find(widget => {
          return widget.model === cellList.get(i);
        });
        // console.log('CELL ELEMENT : ', cellElement);
        if (cellElement) {
          // if the cell element is found, add the hint overlay
          hintOverlay(
            cellList.get(i),
            cellElement.node,
            cellElement?.model.id,
            notebook,
            pioneer
          );
        }
      }
    }
  }
};

export default plugin;
