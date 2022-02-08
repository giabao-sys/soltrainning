pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleERC20 is IERC20, Ownable {
    using SafeMath for uint256;

    string public symbol;
    string public  name;

    uint256 public constant decimals = 12;
    uint256 public override totalSupply;
    uint256 public constant MAX_TOTAL_SUPPLY = 1000 * 10 ** uint256(decimals);
    address public minter;

    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    constructor(string memory initSymbol, string memory initName, uint256 initialSupply) {
        require(initialSupply<= MAX_TOTAL_SUPPLY);
        require(initialSupply > 0);
        totalSupply = initialSupply * 10 ** uint256(decimals);  // Update total supply with the decimal amount
        balanceOf[msg.sender] = totalSupply;                // Give the creator all initial tokens
        name = initName;                                   // Set the name for display purposes
        symbol = initSymbol;                               // Set the symbol for display purposes
        minter = msg.sender;
    }

    function setMinter(address _minter) onlyOwner external returns (bool) {
        minter = _minter;
        return true;
    }

    function approve(address _spender, uint256 _value) external override returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /** shared logic for transfer and transferFrom */
    function _transfer(address _from, address _to, uint256 _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != address(0x0), "Invalid address");
        // Check if the sender has enough
        require(balanceOf[_from] >= _value, "Insufficient balance");

        // Subtract from the sender
        balanceOf[_from] = balanceOf[_from].sub(_value);
        // Add the same to the recipient
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public override returns (bool) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` on behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool)
    {
        require(_value <= allowance[_from][msg.sender], "Insufficient allowance");     // Check allowance
        uint256 allowed = allowance[_from][msg.sender];
        allowance[_from][msg.sender] = allowed.sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }

    function mint(address _to, uint256 _value) external returns (bool) {
        require(msg.sender == minter);
        balanceOf[_to] = balanceOf[_to].add(_value);
        totalSupply = totalSupply.add(_value);
        require(MAX_TOTAL_SUPPLY >= totalSupply);
        emit Transfer(address(0), _to, _value);
        return true;
    }
}
