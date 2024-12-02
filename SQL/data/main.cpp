#include <bits/stdc++.h>
#define int long long
using namespace std;

int n;

main()
{
    freopen("ddata/customer_id.txt", "w", stdout);
    cin>>n;
    cout<<"(";
    for(int i=1;i<=n;i++)
    {
        cout<<i;
        if(i!=n) cout<<", ";
    }
    cout<<")";
    return 0;
}
