import PresentationHeader from '../layout/PresentationHeader';
import { computeRecursiveContent } from '../../functions/contentRenderer';

const ItemsSlide = ({ chapter, subchapter, items, currentItemIndex }) => {
  return (
    <div className="relative h-full">
      <PresentationHeader chapter={chapter} subchapter={subchapter} />

      <div className="flex flex-col items-center justify-center h-full">
        <div className="space-y-8 text-xl max-w-2xl">
          {items.map((item, index) => {
            const isVisible = index <= currentItemIndex;
            const itemPosition = items.length > 2 ? 'mt-12' : '';

            return (
              <div key={index}
                className={`trasition-opacity ${isVisible ? 'duration-500 opacity-100' : 'duration-0 opacity-0'} ${itemPosition}`}
              >
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                {computeRecursiveContent(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ItemsSlide; 