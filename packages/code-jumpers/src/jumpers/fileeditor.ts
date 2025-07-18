import { CodeEditor } from '@jupyterlab/codeeditor';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { IDocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor } from '@jupyterlab/fileeditor';

import { JumpHistory } from '../history';
import { IGlobalPosition, ILocalPosition } from '../positions';

import { CodeJumper, jumpers } from './jumper';

export class FileEditorJumper extends CodeJumper {
  editor: FileEditor;
  widget: IDocumentWidget;

  constructor(
    editorWidget: IDocumentWidget<FileEditor>,
    documentManager: IDocumentManager
  ) {
    super();
    this.widget = editorWidget;
    this.documentManager = documentManager;
    this.editor = editorWidget.content;
    this.history = new JumpHistory();
  }

  get path() {
    return this.widget.context.path;
  }

  get editors() {
    return [this.editor.editor];
  }

  jump(jumpPosition: ILocalPosition) {
    let { token } = jumpPosition;

    // TODO: this is common
    // place cursor in the line with the definition
    let position = this.editor.editor.getPositionAt(token.offset)!;
    this.editor.editor.setCursorPosition(position);
    this.editor.editor.setSelection({ start: position, end: position });
    this.editor.editor.focus();
  }

  getOffset(position: CodeEditor.IPosition) {
    return this.editor.editor.getOffsetAt(position);
  }

  getJumpPosition(position: CodeEditor.IPosition): ILocalPosition {
    return {
      token: {
        offset: this.getOffset(position),
        value: ''
      },
      index: 0
    };
  }

  getCurrentPosition(): IGlobalPosition {
    let position = this.editor.editor.getCursorPosition();
    return {
      editorIndex: 0,
      line: position.line,
      column: position.column,
      contentsPath: this.editor.context.path,
      isSymlink: false
    };
  }
}

jumpers.set('fileeditor', FileEditorJumper);
