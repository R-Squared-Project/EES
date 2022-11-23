import ChaiUtils = Chai.ChaiUtils;
import ChaiStatic = Chai.ChaiStatic;

export default function(chai: ChaiStatic, utils: ChaiUtils) {
    const Assertion = chai.Assertion;

    utils.addProperty(chai.Assertion.prototype, 'repositoryEmpty', function() {
        //@ts-ignore
        const obj = utils.flag(this, 'object');
        //@ts-ignore
        const negate = utils.flag(this, "negate") || false;

        if (negate) {
            new Assertion(obj.size).gte(1, 'Repository is empty')
        } else {
            new Assertion(obj.size).equals(0, 'Repository is not empty')
        }
    });

    utils.addMethod(Assertion.prototype, 'repositorySize', function (size: number) {
        //@ts-ignore
        const obj = utils.flag(this, 'object');

        new Assertion(obj.size).equals(size, `Repository size not equals ${size}`)
    });
}
