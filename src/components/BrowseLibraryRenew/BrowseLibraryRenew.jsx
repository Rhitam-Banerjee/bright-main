import { NewSeriesDump } from "./";
import { AuthorSection, NewSeries, NewGenre } from "./";
const BrowseLibraryRenew = () => {
  return (
    <div>
      <AuthorSection />
      <NewSeriesDump />
      <NewSeries />
      <NewGenre />
    </div>
  );
};
export default BrowseLibraryRenew;
