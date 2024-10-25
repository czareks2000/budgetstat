﻿using Application.Core;
using Application.Dto.Account;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface IAccountService
    {
        // pobranie pojedynczego konta
        Task<Result<AccountDto>> Get(int accountId);
        // pobranie listy kont
        Task<Result<List<AccountDto>>> GetAll();
        // utworzenie konta
        Task<Result<AccountDto>> Create(AccountCreateDto newAccount);
        // edycja konta
        Task<Result<AccountDto>> Update(int accountId, AccountUpdateDto updatedAccount);
        // zmiana statusu konta
        Task<Result<object>> ChangeStatus(int accountId, AccountStatus newStatus);
        // usunięcie konta
        Task<Result<object>> Delete(int accountId, bool deleteRelatedTransactions);
    }
}
