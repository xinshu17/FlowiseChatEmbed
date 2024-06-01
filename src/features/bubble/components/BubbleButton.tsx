import { createSignal } from 'solid-js';
import { Show } from 'solid-js';
import { isNotDefined, getBubbleButtonSize } from '@/utils/index';
import { ButtonTheme } from '../types';

type Props = ButtonTheme & {
  isBotOpened: boolean;
  toggleBot: () => void;
  setButtonPosition: (position: { bottom: number; right: number }) => void; // New prop for updating position
  dragAndDrop: boolean; // Ensure dragAndDrop prop is passed
};

const defaultButtonColor = '#3B81F6';
const defaultIconColor = 'white';
const defaultBottom = 20;
const defaultRight = 20;

export const BubbleButton = (props: Props) => {
  const buttonSize = getBubbleButtonSize(props.size); // Default to 48px if no size is specified

  const [position, setPosition] = createSignal({
    bottom: props.bottom ?? defaultBottom,
    right: props.right ?? defaultRight,
  });

  let dragStartX: number;
  let initialRight: number;

  const onMouseDown = (e: MouseEvent) => {
    if (props.dragAndDrop) {
      dragStartX = e.clientX;
      initialRight = position().right;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    const deltaX = dragStartX - e.clientX;
    const newRight = initialRight + deltaX;

    // Check if the new position is within the screen boundaries
    const screenWidth = window.innerWidth;
    const maxRight = screenWidth - buttonSize;

    const newPosition = {
      right: Math.min(Math.max(newRight, defaultRight), maxRight),
      bottom: position().bottom,
    };

    setPosition(newPosition);
    props.setButtonPosition(newPosition); // Update parent component's state
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <button
      part="button"
      onClick={() => props.toggleBot()}
      onMouseDown={onMouseDown}
      class={`fixed shadow-md rounded-full hover:scale-110 active:scale-95 transition-transform duration-200 flex justify-center items-center animate-fade-in`}
      style={{
        'background-color': props.backgroundColor ?? defaultButtonColor,
        'z-index': 42424242,
        right: `${position().right}px`,
        bottom: `${position().bottom}px`,
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        cursor: props.dragAndDrop ? 'grab' : 'pointer',
      }}
    >
      {/* Persistent Popup Message */}
      <div class="absolute bg-white text-black text-sm px-4 py-2 rounded shadow-lg" style={{ bottom: `${buttonSize + 8}px`, left: `50%`, transform: 'translateX(-50%)' }}>
        This is the bubble button tooltip!
      </div>

      <Show when={isNotDefined(props.customIconSrc)} keyed>
        <svg
          viewBox="0 0 24 24"
          style={{
            stroke: props.iconColor ?? defaultIconColor,
          }}
          class={`stroke-2 fill-transparent absolute duration-200 transition ` + (props.isBotOpened ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}
          width={buttonSize * 0.6}
          height={buttonSize * 0.6}
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </Show>
      <Show when={props.customIconSrc}>
        <img
          src={props.customIconSrc}
          class={'rounded-full object-cover' + (props.isBotOpened ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}
          style={{
            width: `${buttonSize * 0.6}px`,
            height: `${buttonSize * 0.6}px`,
          }}
          alt="Bubble button icon"
        />
      </Show>
    </button>
  );
};
