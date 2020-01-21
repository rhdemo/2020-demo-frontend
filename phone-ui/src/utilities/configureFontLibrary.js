import { library } from '@fortawesome/fontawesome-svg-core'
import {
} from '@fortawesome/free-solid-svg-icons'
import {
  faUserCircle as farUserCircle
} from '@fortawesome/free-regular-svg-icons'

const configureFontLibrary = () => {
  library.add(
    farUserCircle
  );
  return library;
};

export default configureFontLibrary;
