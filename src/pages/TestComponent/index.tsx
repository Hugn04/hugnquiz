import Button from '../../components/Button';
import { fa42Group, fa500px } from '@fortawesome/free-brands-svg-icons';

function TestComponent() {
    return (
        <div>
            <Button
                to="/dán"
                leftIcon={fa42Group}
                onClick={() => {
                    console.log(123);
                }}
                rightIcon={fa500px}
                variant="primary"
            >
                ABCD
            </Button>
        </div>
    );
}

export default TestComponent;
