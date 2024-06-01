import { createSignal } from 'solid-js';
import { Show } from 'solid-js';
import { isNotDefined, getBubbleButtonSize } from '@/utils/index';
import { ButtonTheme } from '../types';

type Props = ButtonTheme & {
  isBotOpened: boolean;
  toggleBot: () => void;
  setButtonPosition: (position: { bottom: number; right: number }) => void;
  dragAndDrop: boolean;
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
  const [showPopup, setShowPopup] = createSignal(true); // Controls visibility of the popup

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

  const handleClick = () => {
    props.toggleBot(); // Call the original toggle function
    setShowPopup(false); // Hide the popup message
  };

  return (
    <button
      part="button"
      onClick={handleClick}
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
      <Show when={showPopup()}>
        <div class="absolute bg-gray-800 text-white text-sm px-3 py-1 rounded" style={{
            top: '-50px', // Adjust this value to position the popup above the button
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px', // Set the width of the popup
            height: 'auto', // Adjust height as necessary, 'auto' for content-based height
            'max-width': '90%', // Ensures the popup does not exceed the screen width on small devices
          }}>
          你好呀！我是小极速，你可以问我任何关于极速工作流的问题~
        </div>
      </Show>

      {/* SVG and Image icon display conditions remain unchanged */}
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
