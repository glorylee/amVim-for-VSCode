import {window, commands, Range} from 'vscode';
import {ActionReveal} from './Reveal';
import {Motion} from '../Motions/Motion';

export class ActionDelete {

    static byMotions(args: {motions: Motion[]}): Thenable<boolean> {
        const activeTextEditor = window.activeTextEditor;

        if (! activeTextEditor) {
            return Promise.resolve(false);
        }

        const ranges = activeTextEditor.selections.map(selection => {
            const start = selection.active;
            const end = args.motions.reduce((position, motion) => {
                return motion.apply(position, {inclusive: true});
            }, start);
            return new Range(start, end);
        });

        // TODO: Deal wits motions' overlaps
        // TODO: Use linewise

        activeTextEditor.edit((editBuilder) => {
            ranges.forEach((range) => editBuilder.delete(range));
        });

        return ActionReveal.primaryCursor();
    }

    static selectionsOrLeft(): Thenable<boolean> {
        return commands.executeCommand('deleteLeft');
    }

    static selectionsOrRight(): Thenable<boolean> {
        return commands.executeCommand('deleteRight');
    }

    static line(): Thenable<boolean> {
        return commands.executeCommand('editor.action.deleteLines')
            .then(ActionReveal.primaryCursor);
    }

};
