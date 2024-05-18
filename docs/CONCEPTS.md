# Concepts

## Rule
A rule is described as a data structure that have two important fields:
- Name
    Name have two important roles. Rules normally have a name that have the following format:
        `${uniqueIdentifier}|${parameters}`.
    The first one as unique identifier for a specify rule. The second role is to parametrize on the rule with arguments. All rules have the parameters as optional field, so if you want to not parametrize and use the rules passing arguments manually, you can do it without problems.
- Error level
    Error level specifies what kind of error should be generated when a problem is found. At total we have three options for this field: `off|warn|error`, which indicates how `Linter` should treat each problem found.
