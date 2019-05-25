export enum TASK_ERRORS{
    schema_invalid = 'task/schema_invalid',
    could_not_find_task_on_id = 'task/could_not_find_task_on_id',
    task_not_yours = 'task/task_not_yours',
}

export enum USER_ERRORS{
    user_not_found = 'user/user_not_found',
    profile_incomplete = 'user/profile_incomplete'
}

export enum AUTH_ERRORS{
    auth_failed = 'auth/auth_failed',
    auth_missing_headers = 'auth/auth_missing_headers',
    auth_missing_authorization = 'auth/auth_missing_authorization',
    auth_authorization_is_array = 'auth/auth_authorization_is_array',
    auth_authorization_not_starting_with_bearer = 'auth/auth_authorization_not_starting_with_bearer',
    auth_failed_user_not_found = 'auth/auth_failed_user_not_found',
}

export enum HTTP_ERRORS{
    https_failed_technical = 'error/https_failed_technical',
    https_failed_status_code = 'error/https_failed_status_code'
}

export enum ERRORS{
    unknown = 'error/unknown',
    wrong_type = 'error/wrong_type'
}