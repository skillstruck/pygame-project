import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import IndexPage from '~/pages/index.vue';

const { execute, launchDisplay, loadDisplay } = vi.hoisted(() => ({
    execute: vi.fn(),
    launchDisplay: vi.fn(),
    loadDisplay: vi.fn(),
}));

// The page renders <LazyTerminal> and <LazyDisplay>, which Nuxt resolves to
// these component files. Stub them so no xterm/websocket/noVNC code runs.
vi.mock('~/components/Terminal.vue', async () => {
    const { defineComponent, h } = await import('vue');
    return {
        default: defineComponent({
            name: 'Terminal',
            emits: ['terminal_ready', 'terminal_clear', 'launch_display', 'load_display'],
            setup(_, { expose }) {
                expose({ execute });
                return () => h('div', { class: 'terminal-stub' });
            },
        }),
    };
});

vi.mock('~/components/Display.vue', async () => {
    const { defineComponent, h } = await import('vue');
    return {
        default: defineComponent({
            name: 'Display',
            setup(_, { expose }) {
                expose({ launchDisplay, loadDisplay });
                return () => h('div', { class: 'display-stub' });
            },
        }),
    };
});

const mountPage = async () => {
    const wrapper = mount(IndexPage);
    await flushPromises();
    return wrapper;
};

describe('index page', () => {
    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        execute.mockClear();
        launchDisplay.mockClear();
        loadDisplay.mockClear();
    });

    it('queues a run until the terminal is ready, then executes the editor code', async () => {
        const wrapper = await mountPage();
        await wrapper.find('textarea').setValue('print("hi")');

        await wrapper.find('button').trigger('click');
        expect(execute).not.toHaveBeenCalled();

        wrapper.findComponent({ name: 'Terminal' }).vm.$emit('terminal_ready');
        expect(execute).toHaveBeenCalledWith('print("hi")');
    });

    it('runs immediately once the terminal is ready', async () => {
        const wrapper = await mountPage();
        wrapper.findComponent({ name: 'Terminal' }).vm.$emit('terminal_ready');
        expect(execute).not.toHaveBeenCalled();

        await wrapper.find('textarea').setValue('print(1)');
        await wrapper.find('button').trigger('click');
        expect(execute).toHaveBeenCalledWith('print(1)');
    });

    it('forwards terminal display events to the display component', async () => {
        const wrapper = await mountPage();
        const terminal = wrapper.findComponent({ name: 'Terminal' });

        terminal.vm.$emit('load_display', true);
        expect(loadDisplay).toHaveBeenCalledWith(true);

        terminal.vm.$emit('launch_display');
        expect(launchDisplay).toHaveBeenCalled();
    });

    it('inserts four spaces at the cursor when Tab is pressed in the editor', async () => {
        const wrapper = await mountPage();
        const textarea = wrapper.find('textarea');
        const element = textarea.element as HTMLTextAreaElement;

        await textarea.setValue('if x:\nreturn');
        element.setSelectionRange(6, 6);
        await textarea.trigger('keydown', { key: 'Tab' });

        expect(element.value).toBe('if x:\n    return');
        expect(element.selectionStart).toBe(10);
        expect(element.selectionEnd).toBe(10);
    });
});
