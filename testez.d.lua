declare function afterAll(testFn: () -> ()): ()
declare function afterEach(testFn: () -> ()): ()

declare function beforeAll(testFn: () -> ()): ()
declare function beforeEach(testFn: () -> ()): ()

declare function describe(phrase: string, testFn: () -> ()): ()
declare function expect(value: any): { [string]: (...any) -> () } 
declare function fdescribe(phrase: string, testFn: () -> ()): ()
declare function fit(phrase: string, testFn: (done: (() -> ())?) -> ()): ()


declare function it(phrase: string, testFn: (done: (() -> ())?) -> ()): ()
declare function itFIXME(phrase: string, testFn: (done: (() -> ())?) -> ()): ()
declare function xdescribe(phrase: string, testFn: () -> ()): ()
declare function xit(phrase: string, testFn: (done: (() -> ())?) -> ()): ()

declare function FOCUS(): ()
declare function SKIP(): ()

