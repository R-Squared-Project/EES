import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import Assertions from "./Helpers/Assertions";
import ExternalBlockchain from "context/ExternalBlockchain/ExternalBlockchain";

chai.use(chaiAsPromised)
chai.use(Assertions)

ExternalBlockchain.init('stub')
