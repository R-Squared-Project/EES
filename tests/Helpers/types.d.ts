declare namespace Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
        repositoryEmpty: Assertion;
        repositorySize: (size: number) => Assertion;
    }
}
