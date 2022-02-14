//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TATU is IERC20 {
    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;

    mapping(address => uint256) internal _balances;
    mapping(address => mapping(address => uint256)) _allowances;
    uint256 private _totalSupply;
    uint256 public constant MAX_TOTAL_SUPPLY = 10000 ** decimals;
    address private _minter;

    constructor(string memory initName, string memory initSymbol, uint256 totalAmount) {
        _minter = msg.sender;
        _mint(msg.sender, totalAmount);
        name = initName;
        symbol = initSymbol;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address to) public view override returns (uint256) {
        return _balances[to];
    }

    function setMinter(address minter) external returns (bool) {
        _minter = minter;
        return true;
    }
    
    function mint(address account, uint256 amount) external returns (bool) {
        _mint(account, amount);
        return true;
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "mint to the zero address");
        require(_totalSupply.add(amount) <= MAX_TOTAL_SUPPLY, "can not mint more than max total supply");
        require(msg.sender == _minter, "minter address do not have permission");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
		return true;
     }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
		return _allowances[owner][spender];
	}

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount));
        return true;
    }
    
	function _transfer(address sender, address recipient, uint256 amount) internal virtual {
		require(sender != address(0), "transfer from the zero address");
		require(recipient != address(0), "transfer to the zero address");

		_balances[sender] = _balances[sender].sub(amount);
		_balances[recipient] = _balances[recipient].add(amount);
		emit Transfer(sender, recipient, amount);
	}

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(spender != address(0));
        require(owner != address(0));

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}