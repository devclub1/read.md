import PanelHeader from '../layout/PanelHeader';

const SubchapterSlide = ({ chapter, title }) => {
  return (
    <div className="relative h-full">
      <PanelHeader chapter={chapter} />

      <div className="flex items-center justify-center h-full text-center">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
};

export default SubchapterSlide; 